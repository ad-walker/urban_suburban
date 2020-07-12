import React from "react";
import { Layout } from "antd";
import NavHeader from "./NavHeader";
import Background from "./Background";
const { Content, Footer } = Layout;
function Page(props) {
  return (
    <Layout className="layout">
      <Background>
        <NavHeader />
        <Content>
          {props.children}
        </Content>
      </Background>
    </Layout>
  );
}
export default Page;

