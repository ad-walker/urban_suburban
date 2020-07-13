import React from "react";
import { PageHeader, Button, Menu, Dropdown, message } from "antd";
import { MenuUnfoldOutlined} from "@ant-design/icons";
import HomeIcon from "../images/icon.svg";
import { useMediaQuery } from "react-responsive";

function NavHeader(props) {
  const isDesktop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  if (isDesktop) {
    return (
      <div className="site-page-header-ghost-wrapper">
        <PageHeader
          extra={[
            <Button key="item1" type="text" size="large">
              Something
            </Button>,
            <Button key="item2" type="text" size="large">
              Something
            </Button>,
            <Button key="item3" type="primary" size="large" shape="round">
              Something
            </Button>,
          ]}
          avatar={{ src: HomeIcon, size: "large", shape: "square" }}
        />
      </div>
    );
  } else {

    const handleMenuClick = (e) => {message.info('Click on menu item.');};
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">
          Something
        </Menu.Item>
        <Menu.Item key="2">
          Something
        </Menu.Item>
        <Menu.Item key="3">
          Something
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
          </Dropdown>
        ]}
          avatar={{ src: HomeIcon, size: "large", shape: "square" }}
        />
    );
  }
}

export default NavHeader;
