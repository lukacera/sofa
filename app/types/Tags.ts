export interface TagData {
    name: string;
    eventCount: number;
    totalAttendees: number;
    lastUsed: string;
  }
  
export interface TagsResponse {
    tags: TagData[];
    count: number;
    timestamp: string;
    metadata: {
      period: string;
      totalEventsWithTags: number;
      totalAttendeesAcrossTags: number;
    }
}