import type { DataProvider } from "react-admin";

export const createDataProvider = (trpc: any): DataProvider => ({
  getList: async (resource, params) => {
    const pagination = params.pagination || { page: 1, perPage: 10 };
    const { page, perPage } = pagination;
    const sort = params.sort || { field: "id", order: "ASC" };
    const { field, order } = sort;

    let data: any[] = [];

    if (resource === "markets") {
      data = await trpc.admin.markets.list.query();
    } else if (resource === "videos") {
      // Get all videos across all markets
      const markets = await trpc.admin.markets.list.query();
      const allVideos = await Promise.all(
        markets.map((m: any) =>
          trpc.admin.videos.list.query({ marketId: m.id }),
        ),
      );
      data = allVideos.flat();
    } else if (resource === "conspiraInfos") {
      // Get all conspiraInfos across all markets
      const markets = await trpc.admin.markets.list.query();
      const allInfos = await Promise.all(
        markets.map((m: any) =>
          trpc.admin.conspiraInfo.list.query({ marketId: m.id }),
        ),
      );
      data = allInfos.flat();
    }

    // Simple client-side sorting and pagination
    const sorted = [...data].sort((a: any, b: any) => {
      if (order === "ASC") {
        return a[field] > b[field] ? 1 : -1;
      }
      return a[field] < b[field] ? 1 : -1;
    });

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = sorted.slice(start, end);

    return {
      data: paginated,
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    if (resource === "markets") {
      const data = await trpc.admin.markets.get.query({ id: params.id });
      return { data };
    }
    if (resource === "videos" || resource === "conspiraInfos") {
      // These resources don't need getOne - React Admin uses getManyReference
      // But if called, we can find the item from the list
      const markets = await trpc.admin.markets.list.query();
      for (const market of markets) {
        if (resource === "videos") {
          const videos = await trpc.admin.videos.list.query({
            marketId: market.id,
          });
          const found = videos.find((v: any) => v.id === params.id);
          if (found) return { data: found };
        } else {
          const infos = await trpc.admin.conspiraInfo.list.query({
            marketId: market.id,
          });
          const found = infos.find((i: any) => i.id === params.id);
          if (found) return { data: found };
        }
      }
    }
    throw new Error(`Resource ${resource} with id ${params.id} not found`);
  },

  getMany: async (resource, params) => {
    if (resource === "markets") {
      const all = await trpc.admin.markets.list.query();
      const filtered = all.filter((item: any) => params.ids.includes(item.id));
      return { data: filtered };
    }
    if (resource === "videos") {
      const markets = await trpc.admin.markets.list.query();
      const allVideos = await Promise.all(
        markets.map((m: any) =>
          trpc.admin.videos.list.query({ marketId: m.id }),
        ),
      );
      const flat = allVideos.flat();
      const filtered = flat.filter((item: any) => params.ids.includes(item.id));
      return { data: filtered };
    }
    if (resource === "conspiraInfos") {
      const markets = await trpc.admin.markets.list.query();
      const allInfos = await Promise.all(
        markets.map((m: any) =>
          trpc.admin.conspiraInfo.list.query({ marketId: m.id }),
        ),
      );
      const flat = allInfos.flat();
      const filtered = flat.filter((item: any) => params.ids.includes(item.id));
      return { data: filtered };
    }
    return { data: [] };
  },

  getManyReference: async (resource, params) => {
    if (resource === "videos") {
      const data = await trpc.admin.videos.list.query({
        marketId: params.id,
      });
      return { data, total: data.length };
    }
    if (resource === "conspiraInfos") {
      const data = await trpc.admin.conspiraInfo.list.query({
        marketId: params.id,
      });
      return { data, total: data.length };
    }
    return { data: [], total: 0 };
  },

  create: async (resource, params) => {
    if (resource === "markets") {
      const data = await trpc.admin.markets.create.mutate(params.data);
      return { data };
    }
    if (resource === "videos") {
      const data = await trpc.admin.videos.create.mutate(params.data);
      return { data };
    }
    if (resource === "conspiraInfos") {
      const data = await trpc.admin.conspiraInfo.create.mutate(params.data);
      return { data };
    }
    throw new Error(`Resource ${resource} not supported`);
  },

  update: async (resource, params) => {
    if (resource === "markets") {
      const data = await trpc.admin.markets.update.mutate({
        id: params.id,
        ...params.data,
      });
      return { data };
    }
    if (resource === "videos") {
      const data = await trpc.admin.videos.update.mutate({
        id: params.id,
        ...params.data,
      });
      return { data };
    }
    if (resource === "conspiraInfos") {
      const data = await trpc.admin.conspiraInfo.update.mutate({
        id: params.id,
        ...params.data,
      });
      return { data };
    }
    throw new Error(`Resource ${resource} not supported`);
  },

  updateMany: async (resource, params) => {
    // Not implemented for now
    return { data: params.ids };
  },

  delete: async (resource, params) => {
    if (resource === "markets") {
      const deleted = await trpc.admin.markets.delete.mutate({
        id: params.id as string,
      });
      return { data: deleted };
    }
    if (resource === "videos") {
      const deleted = await trpc.admin.videos.delete.mutate({
        id: params.id as string,
      });
      return { data: deleted };
    }
    if (resource === "conspiraInfos") {
      const deleted = await trpc.admin.conspiraInfo.delete.mutate({
        id: params.id as string,
      });
      return { data: deleted };
    }
    throw new Error(`Resource ${resource} not supported`);
  },

  deleteMany: async (resource, params) => {
    // Delete one by one
    for (const id of params.ids) {
      if (resource === "markets") {
        await trpc.admin.markets.delete.mutate({ id });
      } else if (resource === "videos") {
        await trpc.admin.videos.delete.mutate({ id });
      } else if (resource === "conspiraInfos") {
        await trpc.admin.conspiraInfo.delete.mutate({ id });
      }
    }
    return { data: params.ids };
  },
});
