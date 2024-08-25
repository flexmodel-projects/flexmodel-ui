import * as React from "react";
import {HashRouter, Route, Routes} from "react-router-dom";
import {Provider} from "react-redux";
import {ConfigProvider} from "antd";
import enUS from 'antd/es/locale/en_US';
import {configureStore, initStore} from "./store/configStore.ts";
import PageLayout from "./components/layouts/PageLayout.tsx";
const store = configureStore();
store.dispatch<any>(initStore());

class App extends React.Component<unknown, unknown> {
  public render() {
    return (
      <ConfigProvider locale={enUS}>
        <Provider store={store}>
          <HashRouter>
            <Routes>
              <Route path="/*" element={<PageLayout/>}/>
            </Routes>
          </HashRouter>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default App;
