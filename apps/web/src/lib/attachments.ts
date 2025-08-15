import prisma from "@/lib/prisma"

type AttachmentWithKey = {
  active_storage_blobs?: {
    key: string | null
  } | null
}

export async function getImageUrlsByRecord(
  type: string,
  id: bigint | number,
  name: string = "images" // default là "images"
) {
  const attachments: AttachmentWithKey[] = await prisma.active_storage_attachments.findMany({
    where: {
      record_type: type,
      record_id: BigInt(id),
      name: name, // lọc theo tên field
    },
    orderBy: { id: "asc" },
    select: {
      active_storage_blobs: { select: { key: true } },
    },
  })

  return attachments
    .map((att) => att.active_storage_blobs?.key)
    .filter((key): key is string => Boolean(key))
    .map((key) => `https://res.cloudinary.com/dq7vadalc/image/upload/${key}`)
}
