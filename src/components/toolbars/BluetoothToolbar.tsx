import { Grid } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import RefreshIcon from '@mui/icons-material/Refresh';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { PageToolbarButton, ToolbarDivider } from "../dashboard/PageToolbar";
import { handleServerRestError } from "../../services/notifications.service";
import { useState } from "react";
import { ApiFacade } from "../../infrastructure/generated/proxies/api-proxies";
import { devicesService } from "../../services/devices.service";
import { bluetoothService } from "../../services/bluetooth.service";

export function BluetoothToolbar() {
	const { t } = useTranslation();

	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [rescanning, setRescanning] = useState<boolean>(false);

	async function refresh(): Promise<boolean> {
		setRefreshing(true);
		let succeed = false;
		try {
			// await bluetoothService.forceFetchData();
			await bluetoothService.fetchData();
			succeed = true;
		} catch (error) {
			handleServerRestError(error);
		}
		setRefreshing(false);
		return succeed;
	}

	/** Scan bluetooth device */
	async function rescan(): Promise<boolean> {
		let succeed = false;
		setRescanning(true);
		try {
			await ApiFacade.DevicesApi.rescanBluetoothDevices();
			// Once scan finished, fetch the new changes and update the service subscribers
			await bluetoothService.fetchData();
			succeed = true;
		} catch (error) {
			handleServerRestError(error);
		}
		setRescanning(false);
		return succeed;
	}

	return <Grid
		style={{ padding: 10 }}
		container
		direction="row"
		justifyContent="center"
		alignItems="center"
	>
		<PageToolbarButton
			loading={refreshing}
			disabled={refreshing}
			runAction={refresh}
			text={t('global.refresh')}
			Icon={RefreshIcon}
			// todo add lang
			tip={t('dashboard.toolbar.pages.bluetooth.refresh.tip')}
		/>
		<ToolbarDivider />
		<PageToolbarButton
			loading={rescanning}
			disabled={rescanning}
			runAction={rescan}
			// todo add lang
			text={t('dashboard.toolbar.pages.bluetooth.re.scan')}
			Icon={TrackChangesIcon}
			// todo add lang
			tip={t('dashboard.toolbar.pages.bluetooth.re.scan.tip')}
		/>
	</Grid>;
}
