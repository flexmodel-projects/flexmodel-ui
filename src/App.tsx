import {HashRouter, Route, Routes} from "react-router-dom";
import {ConfigProvider} from "antd";
import PageLayout from "./components/layouts/PageLayout.tsx";
import {useSelector} from "react-redux";
import {RootState} from "./store/configStore.ts";

const App = () => {
  const {locale} = useSelector((state: RootState) => state.locale);
  return (
    <ConfigProvider locale={locale}>
      <HashRouter>
        <Routes>
          <Route path="/*" element={<PageLayout/>}/>
        </Routes>
      </HashRouter>
    </ConfigProvider>
  );
}

export default App;
