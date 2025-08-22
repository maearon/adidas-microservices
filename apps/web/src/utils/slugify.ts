export const slugify = (name: unknown): string => {
  if (typeof name !== "string") return "";

  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // bỏ ký tự đặc biệt
    .replace(/\s+/g, "-");    // khoảng trắng => dấu gạch ngang
};
