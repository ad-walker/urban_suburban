import React from "react";
import { Layout } from "antd";
import NavHeader from "./NavHeader";
import background from "./Background";
import Background from "./Background";
const { Content, Footer } = Layout;
function Page(props) {
  return (
    <Layout className="layout">
      <Background>
        <NavHeader />
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">{props.children}</div>
        </Content>
      </Background>
    </Layout>
  );
}
export default Page;

