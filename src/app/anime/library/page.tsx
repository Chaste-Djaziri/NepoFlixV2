import { siteConfig } from "@/config/site";
import { Metadata, NextPage } from "next/types";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/server";
const UnauthorizedNotice = dynamic(() => import("@/components/ui/notice/Unauthorized"));
const LibraryList = dynamic(() => import("@/components/sections/Library/List"));

export const metadata: Metadata = {
  title: `Library | ${siteConfig.name}`,
};

const LibraryPage: NextPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <Suspense>
      {error || !user ? (
        <UnauthorizedNotice
          title="Sign in to access your library"
          description="Create a free account to save your favorite movies and TV shows!"
        />
      ) : (
        <LibraryList />
      )}
    </Suspense>
  );
};

export default LibraryPage;
