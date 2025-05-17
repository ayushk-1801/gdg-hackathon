import "dotenv/config";
declare const db: import("drizzle-orm/node-postgres").NodePgDatabase<Record<string, never>> & {
    $client: import("drizzle-orm/node-postgres").NodePgClient;
};
export default db;
//# sourceMappingURL=index.d.ts.map