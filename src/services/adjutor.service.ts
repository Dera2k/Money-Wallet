import config from "../config";

interface KarmaResponse {
    status: string;
    message : string;
    data?: {
        karma_identity: string;
        status: string;
    };
}

export class AdjutorService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = config.adjutor.apiUrl;
    }

    async checkBlacklist(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/${email}`);

      //user not found in blacklist therefore not blaacklisted
      if (response.status === 404) {
        return false;
      }

      //api error fail-safe, allow registration
      if (!response.ok) {
        console.error('Adjutor API error:', response.status);
        return false;
      }

      const data: KarmaResponse = await response.json();

      return data.status === 'success' && data.data?.status === 'blacklisted';
    } catch (error) {
      //api down = fail-safe, allow registration
      console.error('Adjutor API error:', error);
      return false;
    }
  }
}