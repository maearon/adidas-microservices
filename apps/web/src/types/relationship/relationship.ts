// 🤝 Types for Follow/Unfollow (Relationships)

export interface RelationshipCreateParams {
  followed_id: string | string[] | undefined
}

export interface RelationshipCreateResponse {
  follow: boolean
}

export interface RelationshipDestroyResponse {
  unfollow: boolean
}

// Relationship-related types

// TODO: Add code here...

// 📁 @types/relationship.ts

/** ➕ Request body to follow a user/product/cart */
export interface RelationshipCreateParams {
  followed_id: string | string[] | undefined;
}

/** ✅ Response when following succeeds */
export interface RelationshipCreateResponse {
  follow: boolean;
}

/** ❌ Response when unfollowing succeeds */
export interface RelationshipDestroyResponse {
  unfollow: boolean;
}
