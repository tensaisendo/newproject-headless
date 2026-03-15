// useHandleGetPostsArchivePage.tsx
import { useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  OrderEnum,
  PostObjectsConnectionOrderbyEnum,
} from "@/__generated__/graphql";
import { FILTERS_OPTIONS, GET_POSTS_FIRST_COMMON } from "@/contains/contants";
import { PostDataFragmentType } from "@/data/types";
import { QUERY_GET_POSTS_BY } from "@/fragments/queries";
import errorHandling from "@/utils/errorHandling";
import updatePostFromUpdateQuery from "@/utils/updatePostFromUpdateQuery";

// ✅ Type spécifique pour filterParam utilisé dans GraphQL ORDERBY
export type FilterValueType = "DATE/ASC" | "DATE/DESC";

interface Props {
  initPosts?: PostDataFragmentType[] | null;
  initPostsPageInfo?: {
    endCursor?: string | null;
    hasNextPage: boolean;
  } | null;
  tagDatabaseId?: number | null;
  categoryDatabaseId?: number | null;
  authorDatabaseId?: number | null;
  categorySlug?: string | null;
  search?: string | null;
}

export default function useHandleGetPostsArchivePage(props: Props) {
  const {
    categoryDatabaseId,
    initPosts: posts,
    initPostsPageInfo,
    tagDatabaseId,
    authorDatabaseId,
    categorySlug,
    search,
  } = props;

  // ✅ filterParam typé correctement pour la prod Vercel
  const [filterParam, setfilterParam] = useState<FilterValueType | undefined>();
  const [refetchTimes, setRefetchTimes] = useState(0);
  const routerQueryFilter = filterParam;

  const [queryGetPostsByCategoryId, postsByCategoryIdResult] = useLazyQuery(
    QUERY_GET_POSTS_BY,
    {
      variables: {
        categoryId: categoryDatabaseId,
        categoryName: categorySlug,
        tagId: tagDatabaseId?.toString(),
        author: authorDatabaseId,
        search,
        first: GET_POSTS_FIRST_COMMON,
      },
      notifyOnNetworkStatusChange: true,
      context: { fetchOptions: { method: process.env.NEXT_PUBLIC_SITE_API_METHOD || "GET" } },
      onError: (error) => {
        if (refetchTimes > 3) {
          errorHandling(error);
          return;
        }
        setRefetchTimes(refetchTimes + 1);
        postsByCategoryIdResult.refetch();
      },
    }
  );

  function checkRouterQueryFilter() {
    if (!routerQueryFilter) return false;
    const [field, order] = routerQueryFilter.split("/");
    return {
      field: field as PostObjectsConnectionOrderbyEnum,
      order: order as OrderEnum,
    };
  }

  // Charger posts selon le filter
  useEffect(() => {
    if (!routerQueryFilter) return;
    const filterValue = checkRouterQueryFilter();
    if (!filterValue) return;

    queryGetPostsByCategoryId({
      variables: {
        first: GET_POSTS_FIRST_COMMON,
        after: "",
        field: filterValue.field,
        order: filterValue.order,
      },
    });
  }, [routerQueryFilter]);

  const handleClickShowMore = () => {
    if (!postsByCategoryIdResult.called) {
      queryGetPostsByCategoryId({
        variables: { after: initPostsPageInfo?.endCursor, first: GET_POSTS_FIRST_COMMON },
      });
    } else {
      postsByCategoryIdResult.fetchMore({
        variables: { after: postsByCategoryIdResult.data?.posts?.pageInfo?.endCursor, first: GET_POSTS_FIRST_COMMON },
        updateQuery: (prev, { fetchMoreResult }) => updatePostFromUpdateQuery(prev, fetchMoreResult),
      });
    }
  };

  // ✅ Correction clé pour Vercel : cast vers FilterValueType
  const handleChangeFilterPosts = (item: typeof FILTERS_OPTIONS[number]) => {
    setfilterParam(item.value as FilterValueType);
  };

  // Préparer les données pour le rendu
  let loading = postsByCategoryIdResult.loading;
  let currentPosts = posts || [];
  let hasNextPage = !!initPostsPageInfo?.hasNextPage;

  currentPosts = [
    ...(!checkRouterQueryFilter() ? posts || [] : []),
    ...((postsByCategoryIdResult.data?.posts?.nodes as PostDataFragmentType[]) || []),
  ];

  if (!currentPosts.length && loading && filterParam === "DATE/DESC") {
    currentPosts = posts || [];
  }

  if (postsByCategoryIdResult.called) {
    hasNextPage =
      !!postsByCategoryIdResult.data?.posts?.pageInfo?.hasNextPage ||
      postsByCategoryIdResult.loading;
  }

  return {
    loading,
    currentPosts,
    hasNextPage,
    handleClickShowMore,
    handleChangeFilterPosts,
  };
}