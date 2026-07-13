# JetVina content mapping (SAFE_REFERENCE_MODE)

| Source type | Source identifier | Target module | Target route | Target entity | Transformation | Publish rule |
| ----------- | ----------------- | ------------- | ------------ | ------------- | -------------- | ------------ |
| WP page meta | `/about-us` | About CMS | `/[locale]/about-us` | ContentArticle PAGE | ORIGINAL_REWRITE | Review required |
| WP page meta | `/service` | Services | service pages | ContentArticle / page-content | FACTS_ONLY taxonomy + rewrite | Review |
| WP CPT | `empty_legs` | Empty Leg | `/empty-leg` | EmptyLegOffer | FACTS_ONLY (route/date) if authorized later | No auto import now |
| WP CPT | `fleet` | Aircraft | aircraft admin | AircraftModel | FACTS_ONLY manufacturer/model | Review |
| WP categories | destinations, vietnam, news | Destination / News | existing | Destination / ContentArticle | FACTS_ONLY tags | Review |
| WP page | privacy/terms/legal | Legal | legal pages | ContentArticle LEGAL | **BLOCK** | Legal review only |
| Site brand | client confirm | SiteSetting | header/footer | SiteSetting `brand` | MANUAL_ENTRY | Versioned |
| Contact | client confirm | SiteSetting | contact | SiteSetting | CLIENT_PROVIDED | Review |
| Logo | client file | MediaAsset | header | MediaAsset | CLIENT_PROVIDED | Rights approve |

JetVina structure discovered (public): pages about-us, service, private-jets, empty-legs-list, contact-us, news, memberships CPT, fleet CPT, experience CPT, careers CPT. Legal pages blocked from sync.
