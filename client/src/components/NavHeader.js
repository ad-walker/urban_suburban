import React from "react";
import { PageHeader, Button, Menu, Dropdown } from "antd";
import { MenuUnfoldOutlined, GithubOutlined } from "@ant-design/icons";
import HomeIcon from "../images/icon.svg";
import { useMediaQuery } from "react-responsive";
import { Link } from "@reach/router";
// TODO: Split these into two components rather than evaluating in one.
function NavHeader(props) {
  // Get that screen size.
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  // Desktop nav is a bar across the top.
  if (isDesktop) {
    return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          extra={[
            <Button key="home" type="text" size="large">
              <Link to="/"> Home</Link>
            </Button>,
            <Button key="about" type="text" size="large">
              <Link to="/about"> About</Link>
            </Button>,
            <Button
              key="item3"
              type="primary"
              size="large"
              shape="round"
              icon={<GithubOutlined />}
            >
              Fork Me
            </Button>,
          ]}
          avatar={{ src: HomeIcon, size: "large", shape: "square" }}
        />
      </div>
    );
  }
  // Mobile is a drop down.
  else {
    const menu = (
      <Menu>
        <Menu.Item key="home">
          <Link to="/"> Home</Link>
        </Menu.Item>
        <Menu.Item key="about">
          <Link to="/about">About</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <GithubOutlined />
          Fork
        </Menu.Item>
      </Menu>
    );
    return (
      <PageHeader
        extra={[
          <Dropdown key="dropdown" overlay={menu}>
            <Button type="primary">
              <MenuUnfoldOutlined />
            </Button>
          </Dropdown>,
        ]}
        avatar={{ src: HomeIcon, size: "large", shape: "square" }}
      />
    );
  }
}
export default NavHeader;
