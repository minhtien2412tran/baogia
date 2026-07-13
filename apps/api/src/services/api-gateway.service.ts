import { Injectable } from '@nestjs/common';
import {
  API_UI_REGISTRY,
  WEB_UI_PAGES,
  endpointKey,
  type ApiEndpointDef,
} from '../constants/api-ui-registry';

/** Web client methods expected in apps/web/src/lib/api.ts */
const WEB_CLIENT_METHODS = new Set([
  'searchAirports',
  'getFixedPriceRoutes',
  'getFixedPriceRoute',
  'requestFixedPriceQuote',
  'getEmptyLegs',
  'getEmptyLeg',
  'subscribeEmptyLegAlerts',
  'requestEmptyLeg',
  'getNews',
  'getNewsArticle',
  'getBlogs',
  'getBlog',
  'getVideos',
  'getDestinations',
  'getContentPage',
  'subscribeNewsletter',
  'searchAircraft',
  'requestQuote',
  'getWorldCupMatches',
  'requestWorldCupQuote',
  'getJetCardPlans',
  'submitJetCardEnquiry',
  'getTravelCreditPackages',
  'submitTravelCreditEnquiry',
  'getPartnerPrograms',
  'submitPartnerApplication',
  'login',
  'register',
  'getMe',
  'getMyBookings',
]);

@Injectable()
export class ApiGatewayService {
  getCatalog() {
    const byTag = API_UI_REGISTRY.reduce<Record<string, ApiEndpointDef[]>>(
      (acc, ep) => {
        (acc[ep.tag] ??= []).push(ep);
        return acc;
      },
      {},
    );

    return {
      name: 'JetVina API Gateway',
      version: '1.0',
      documentation: {
        swagger: '/swagger',
        openapi: '/openapi.json',
        openapiYaml: '/openapi.yaml',
        reference: '/docs/API.md',
        uiAudit: '/api-gateway/ui-audit',
      },
      summary: {
        publicEndpoints: API_UI_REGISTRY.length,
        webPages: WEB_UI_PAGES.length,
        tags: Object.keys(byTag).sort(),
      },
      endpointsByTag: byTag,
    };
  }

  getUiAudit() {
    const registryKeys = new Set(
      API_UI_REGISTRY.map((e) => endpointKey(e.method, e.path)),
    );

    const pageAudits = WEB_UI_PAGES.map((page) => {
      const required = page.endpoints;
      const covered = required.filter((k) => registryKeys.has(k));
      const missing = required.filter((k) => !registryKeys.has(k));
      const status =
        required.length === 0
          ? 'static'
          : missing.length === 0
            ? 'full'
            : covered.length > 0
              ? 'partial'
              : 'uncovered';

      return {
        route: page.route,
        name: page.name,
        kind: page.kind,
        status,
        requiredEndpoints: required,
        coveredEndpoints: covered,
        missingEndpoints: missing,
        notes: page.notes,
      };
    });

    const endpointAudits = API_UI_REGISTRY.map((ep) => ({
      ...ep,
      key: endpointKey(ep.method, ep.path),
      webClientReady: ep.webClientMethod
        ? WEB_CLIENT_METHODS.has(ep.webClientMethod)
        : false,
    }));

    const dynamicPages = pageAudits.filter(
      (p) => p.kind !== 'static' || p.requiredEndpoints.length > 0,
    );
    const fullCoverage = dynamicPages.filter(
      (p) => p.status === 'full' || p.status === 'static',
    ).length;
    const endpointsWithClient = endpointAudits.filter(
      (e) => e.webClientReady,
    ).length;

    return {
      generatedAt: new Date().toISOString(),
      summary: {
        webPagesTotal: WEB_UI_PAGES.length,
        webPagesFullCoverage: fullCoverage,
        webPagesPartial: pageAudits.filter((p) => p.status === 'partial')
          .length,
        webPagesStatic: pageAudits.filter((p) => p.status === 'static').length,
        apiEndpointsTotal: API_UI_REGISTRY.length,
        apiEndpointsImplemented: API_UI_REGISTRY.filter((e) => e.implemented)
          .length,
        webClientMethodsTotal: endpointAudits.filter((e) => e.webClientMethod)
          .length,
        webClientMethodsReady: endpointsWithClient,
        coveragePercent: Math.round(
          (endpointsWithClient /
            Math.max(
              endpointAudits.filter((e) => e.webClientMethod).length,
              1,
            )) *
            100,
        ),
      },
      pages: pageAudits,
      endpoints: endpointAudits,
    };
  }
}
