/** Map Better Auth UUID to stable BigInt for legacy wishes.user_id column */
export function userIdToLegacyBigInt(userId: string): bigint {
  const hex = userId.replace(/-/g, "").slice(0, 16)
  return BigInt(`0x${hex}`)
}
