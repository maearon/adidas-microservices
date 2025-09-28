import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import LandingPageClient from "./LandingPageClient";

const LandingPage = async () => {
  const queryClient = new QueryClient();
  // ... (nếu cần prefetch query thì thêm ở đây)
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <LandingPageClient />
    </HydrationBoundary>
  );
};

export default LandingPage;
