export type Category = {
    _id: string;
    name: string;
    slug: string;
    imageUrl: string;
    keywords: string[]; // For matching tags
    followerCount: number;
}