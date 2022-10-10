import React from "react";
import Router from "next/router";

export type CategoryProps = {
  id: number;
  name: string;
  description?: string;
  group: {
    id: string;
    name: string;
  } | null;
};

const Category: React.FC<{ category: CategoryProps }> = ({ category }) => {
  return (
    <div onClick={() => Router.push("/category/[id]", `/category/${category.id}`)}>
      <h1>{category.name}</h1>
      <p>{category.description}</p>
    </div>
  );
};

export default Category
