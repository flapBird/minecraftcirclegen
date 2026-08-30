export interface MinecraftPlayerProfile {
  username: string;
  uuid: string;
  uuidCompact: string;
  skinUrl: string | null;
}

export type PlayerLookupErrorCode =
  | "invalid_input"
  | "not_found"
  | "rate_limited"
  | "upstream_error";

export interface PlayerLookupSuccessResponse {
  status: "found";
  player: MinecraftPlayerProfile;
}

export interface PlayerLookupErrorResponse {
  status: "error";
  error: {
    code: PlayerLookupErrorCode;
    message: string;
  };
}

export type PlayerLookupResponse = PlayerLookupSuccessResponse | PlayerLookupErrorResponse;
