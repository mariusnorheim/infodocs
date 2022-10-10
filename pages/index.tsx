import React from "react";
import type { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Category, { CategoryProps } from "../components/Category";
import prisma from '../lib/prisma'

export const getServerSideProps: GetServerSideProps = async () => {
  const categoryList = await prisma.category.findMany({
    orderBy: { id: "asc" },
  })
  return {
    props: { categoryList },
  };
};

type Props = {
  categoryList: CategoryProps[];
};

const Index: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Categories</h1>
        <main>
          {props.categoryList?.map((category) => (
            <div key={category.id} className="category">
              <Category category={category} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Index;
