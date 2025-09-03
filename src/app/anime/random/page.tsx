"use client";
import { useEffect } from "react";
import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function RandomAnimePage() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("https://api.jikan.moe/v4/random/anime");
        const j = await r.json();
        const id = j?.data?.mal_id;
        if (id) router.replace(`/anime/${id}`);
        else router.replace("/anime");
      } catch {
        router.replace("/anime");
      }
    })();
  }, [router]);

  return (
    <div className="flex h-[50vh] items-center justify-center">
      <Spinner size="lg" color="primary" />
    </div>
  );
}
