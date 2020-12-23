export const isProduction = () => {
    return process.env.PRODUCTION !== undefined && process.env.PRODUCTION === "true"
}

export const DATA_DIR = isProduction() ? "/app/data" : "/home/kscott/projects/bluebox/app/data"
export const PUBLIC_DIR = isProduction() ? "/app/public" : "/home/kscott/projects/bluebox/app/public"