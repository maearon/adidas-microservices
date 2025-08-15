import { ErrorBoundary } from "react-error-boundary";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/trpc/server";
import { getSession } from "@/lib/auth";

import { HomePageContents } from "./_ui/home-page-contents";
import MaintenancePage from "@/_components/MaintenancePage";
import FullScreenLoader from "@/components/ui/FullScreenLoader";

const HomePage = async () => {
  const session = await getSession();

  if(!session) redirect("/account_login");
  
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ErrorBoundary fallback={<MaintenancePage />}>
        <Suspense fallback={<FullScreenLoader />}>
          <HomePageContents/>
        </Suspense>
      </ErrorBoundary>
    </HydrationBoundary>
  );
};

export default HomePage;
