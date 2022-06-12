import { BluetoothDevice } from "../infrastructure/generated/api";
import { ApiFacade } from "../infrastructure/generated/proxies/api-proxies";
import { DataService } from "../infrastructure/data-service-base";

class BluetoothService extends DataService<BluetoothDevice[]> {

    fetchData(): Promise<BluetoothDevice[]> {
        // Get the fetch data function (without activating it yet)
        return ApiFacade.DevicesApi.getBluetoothDevices();
    }
}

export const bluetoothService = new BluetoothService();
