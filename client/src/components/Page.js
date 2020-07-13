import React from "react";
import NavHeader from "./NavHeader";
import Background from "./Background";
import { Layout } from "antd";
const { Content } = Layout;
function Page(props) {
  return (
      <Layout className="layout">
        <Background>
          <NavHeader />
          <Content>{props.children}</Content>
        </Background>
      </Layout>
  );
}
export default Page;