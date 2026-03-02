import PhoneFrame from "./components/PhoneFrame";
import LockScreen from "./core/LockScreen/LockScreen";
import { useOSStore } from "./store/useOSStore";
import StatusBar from "./components/StatusBar";

import ControlCenter from "./core/ControlCenter/ControlCenter";
import HomeScreen from "./core/HomeScreen/HomeScreen";


function App() {
  const isUnlocked = useOSStore((s) => s.isUnlocked);

  return (
    <PhoneFrame>
      <StatusBar />
      {!isUnlocked ? (
        <LockScreen />
      ) : (
        <HomeScreen />
      )}
      <ControlCenter />
    </PhoneFrame>
  );
}

export default App;
