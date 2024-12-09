/**
 * SPDX-License-Identifier: AGPL-3.0-only
 * SPDX-FileCopyrightText: 2024 Univention GmbH
 */

const issuerBaseUrl =
  process.env.ISSUER_BASE_URL ??
  `${process.env.KEYCLOAK_URL}/auth/realms/${process.env.REALM_NAME}`;

const config = {
  corsOptions: {
    methods: "GET,POST,PUT,DELETE,PROPFIND,MKCOL",
    credentials: true,
    // TODO: can we drop Authorization?
    exposedHeaders: [
      "etag",
      "dav",
      "Content-Security-Policy",
      "Location",
      "Authorization",
      "depth",
      "content-type",
      "ocs-apirequest",
    ],
    origin: new RegExp(process.env.ORIGIN_REGEX),
  },
  issuerBaseUrl,
  logLevel: `${process.env.LOG_LEVEL}`.toLowerCase() ?? "info",
  userUniqueMapper: process.env.USER_UNIQUE_MAPPER ?? "entryuuid",
  nordeck: {
    url: process.env.NORDECK_URL,
  },
  portal: {
    url: process.env.PORTAL_URL,
    secret: process.env.PORTAL_API_KEY,
  },
  ox: {
    audience: process.env.OX_AUDIENCE,
  },
  nextcloud: {
    url: process.env.NC_URL,
    audience: process.env.NC_AUDIENCE,
  },
  intercom: {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    proxy: JSON.parse((process.env.PROXY ?? "false").toLowerCase()),
    secret: process.env.SECRET,
    baseUrl: process.env.BASE_URL,
  },
  matrix: {
    url: process.env.MATRIX_URL,
    appServiceSecret: process.env.MATRIX_AS_SECRET,
  },
  redis: {
    user: process.env.REDIS_USER ?? "default",
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST ?? "redis-intercom",
    port: process.env.REDIS_PORT ?? 6379,
  },
};

module.exports = config;
