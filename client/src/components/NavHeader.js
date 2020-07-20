import React from "react";
import { Link } from "@reach/router";
import MediaQuery from "react-responsive";
import { PageHeader, Button, Menu, Dropdown } from "antd";
import { MenuUnfoldOutlined, GithubOutlined } from "@ant-design/icons";
import HomeIcon from "../images/icon.svg";
// TODO: Split these into two components rather than evaluating in one.
function NavHeader() {

  const mobileMenu = (
    <Menu>
      <Menu.Item key="home">
        <Link to="/"> Home</Link>
      </Menu.Item>
      <Menu.Item key="faq">
        <Link to="/faq">FAQ</Link>
      </Menu.Item>
      <Menu.Item key="3" onClick={() => window.open("https://github.com/ad-walker/", "_blank")}>
        <GithubOutlined />
        My GitHub
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      {/* Desktop */}
      <MediaQuery minDeviceWidth={1224}>
        <div className="site-page-header-ghost-wrapper">
          <PageHeader
            extra={[
              <Button key="home" type="text" size="large">
                <Link to="/"> Home</Link>
              </Button>,
              <Button key="faq" type="text" size="large">
                <Link to="/faq"> FAQ</Link>
              </Button>,
              <Button
                key="item3"
                type="primary"
                size="large"
                shape="round"
                icon={<GithubOutlined />}
                // Hacky workaround of weird antd styling
                onClick={() => window.open("https://github.com/ad-walker/", "_blank")}
              >
                My GitHub
              </Button>,
            ]}
            avatar={{ src: HomeIcon, size: "large", shape: "square" }}
          />
        </div>
      </MediaQuery>
      {/* Mobile */}
      <MediaQuery maxDeviceWidth={1224}>
        <div>
          <PageHeader
            extra={[
              <Dropdown key="dropdown" overlay={mobileMenu}>
                <Button type="primary">
                  <MenuUnfoldOutlined />
                </Button>
              </Dropdown>,
            ]}
            avatar={{ src: HomeIcon, size: "large", shape: "square" }}
          />
        </div>
      </MediaQuery>
    </>
  );
}
export default NavHeader;
