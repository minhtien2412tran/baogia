import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  CallTargetDto,
  CreateConversationDto,
  SendMessageDto,
} from './realtime.dto';

const STAFF_ROLES = new Set(['ADMIN', 'SALES', 'CONTRACT_APPROVER']);

@Injectable()
export class RealtimeService {
  constructor(private readonly prisma: PrismaService) {}

  isStaff(role?: string) {
    return STAFF_ROLES.has(String(role ?? ''));
  }

  async createConversation(
    userId: number,
    role: string,
    dto: CreateConversationDto,
  ) {
    let bookingUserId: number | null = null;
    if (dto.bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: dto.bookingId },
        select: { userId: true },
      });
      if (!booking) throw new NotFoundException('Booking not found');
      if (!this.isStaff(role) && booking.userId !== userId) {
        throw new ForbiddenException('You cannot open a conversation for this booking');
      }
      bookingUserId = booking.userId;
    }

    const memberIds = Array.from(new Set([userId, bookingUserId].filter(
      (id): id is number => id !== null,
    )));
    return this.prisma.conversation.create({
      data: {
        bookingId: dto.bookingId,
        createdById: userId,
        subject: dto.subject?.trim() || null,
        members: {
          create: memberIds.map((memberId) => ({
            userId: memberId,
            role: memberId === userId ? 'OWNER' : 'MEMBER',
          })),
        },
      },
      include: { members: true },
    });
  }

  async listConversations(userId: number, role: string) {
    return this.prisma.conversation.findMany({
      where: this.isStaff(role)
        ? undefined
        : { members: { some: { userId } } },
      orderBy: { updatedAt: 'desc' },
      include: {
        members: { select: { userId: true, role: true, lastReadAt: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }

  async getConversation(publicId: string, userId: number, role: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { publicId },
      include: { members: true },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    this.assertAccess(conversation.members, userId, role);
    return conversation;
  }

  async joinAsStaff(publicId: string, userId: number, role: string) {
    if (!this.isStaff(role)) {
      throw new ForbiddenException('Staff access required');
    }
    const conversation = await this.prisma.conversation.findUnique({
      where: { publicId },
      select: { id: true },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    await this.prisma.conversationMember.upsert({
      where: {
        conversationId_userId: { conversationId: conversation.id, userId },
      },
      create: { conversationId: conversation.id, userId, role: 'SUPPORT' },
      update: { role: 'SUPPORT' },
    });
    return this.getConversation(publicId, userId, role);
  }

  async listMessages(
    publicId: string,
    userId: number,
    role: string,
    cursor?: number,
  ) {
    const conversation = await this.getConversation(publicId, userId, role);
    return this.prisma.chatMessage.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 100,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });
  }

  async sendMessage(
    publicId: string,
    userId: number,
    role: string,
    dto: SendMessageDto,
  ) {
    const conversation = await this.getConversation(publicId, userId, role);
    const content = dto.content.trim();
    if (!content) throw new ForbiddenException('Message cannot be empty');
    const message = await this.prisma.chatMessage.create({
      data: { conversationId: conversation.id, senderId: userId, content },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
    });
    await this.prisma.conversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });
    return message;
  }

  async markRead(publicId: string, userId: number, role: string) {
    const conversation = await this.getConversation(publicId, userId, role);
    await this.prisma.conversationMember.updateMany({
      where: { conversationId: conversation.id, userId },
      data: { lastReadAt: new Date() },
    });
    return { ok: true };
  }

  async canSignal(
    publicId: string,
    userId: number,
    role: string,
    target: CallTargetDto,
  ) {
    const conversation = await this.getConversation(publicId, userId, role);
    const targetMember = conversation.members.some(
      (member) => member.userId === target.toUserId,
    );
    if (!targetMember) {
      throw new ForbiddenException('Call target is not in this conversation');
    }
    return conversation;
  }

  private assertAccess(
    members: Array<{ userId: number }>,
    userId: number,
    role: string,
  ) {
    if (!this.isStaff(role) && !members.some((member) => member.userId === userId)) {
      throw new ForbiddenException('You are not a conversation member');
    }
  }
}
