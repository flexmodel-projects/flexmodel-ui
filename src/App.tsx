import * as React from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import enUS from 'antd/es/locale/en_US';
import PageLayout from "./components/layouts/PageLayout.tsx";

class App extends React.Component<unknown, unknown> {
  public render() {
    return (
      <ConfigProvider locale={enUS}>
        <HashRouter>
          <Routes>
            <Route path="/*" element={<PageLayout/>}/>
          </Routes>
        </HashRouter>
      </ConfigProvider>
    );
  }
}

export default App;
