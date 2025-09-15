# %%
from func import *
import matplotlib.pyplot as plt
import pandas as pd

import xarray as xr


str_path ="pr_hyras_1_2025_v6-0_de.nc"

ds = xr.open_dataset(str_path)


# %%
all_dfs = []

for t_index in range(ds.sizes["time"]):
    precip = ds['pr'].isel(time=t_index).values      # (y, x)
    lat = ds['lat'].values                           # (y, x)
    lon = ds['lon'].values                           # (y, x)
    timestamp = ds['time'].values[t_index]           # scalar numpy.datetime64

    df = (pd.DataFrame({
        'time': timestamp,
        'lat': lat.flatten(),
        'lon': lon.flatten(),
        'precip': precip.flatten()
    })
     .assign(precip = lambda df_:df_.precip.round(2).astype(float))
    .dropna()


    .query("lat >= 51.9")
    .query("lat <= 52.1")
    .query("lon >=8.4")
    .query("lon <= 8.7")
    .assign(tag = lambda df_:df_.precip)
    )

    all_dfs.append(df)

# Combine all into one big DataFrame
full_df = pd.concat(all_dfs, ignore_index=True)
full_df

# %%


df_aggregated = (

    full_df
    .groupby(['lat', 'lon'])
    .agg({'precip': ['sum', 'count'] })
    .reset_index()
    .flatten_columns(sep = "_")
    .rename(columns = {'lat_':'lat', 'lon_':'lon'})
    .assign(precip_sum = lambda df_:df_.precip_sum.round(1))
    .sort_values('precip_sum', ascending=False)
)

df_aggregated

# %%

a = df_aggregated['precip_sum']

# Compute histogram
counts, bin_edges = np.histogram(a, bins=10)

# Plot manually with bar
plt.bar(bin_edges[:-1], counts, width=np.diff(bin_edges), edgecolor="black", align="edge")
plt.xlabel('Precipitation Sum')
plt.ylabel('Frequency')
plt.title('Histogram of Precipitation Sum')
plt.show()


# %%

(
    df_aggregated
    .normalize_column('precip_sum')
    .assign(tag = lambda df_:df_.precip_sum.map(str)+ " mm")
    .assign(precip_sum_normalized = lambda df_:df_.precip_sum_normalized * 10)
    .rename(columns = {'precip_sum_normalized':'radius'})
    .query("radius > 0")
    .augment_reason_column("lat: 'lon'<br>lon: 'lon'<br>radius: 'radius'<br>precip_sum: 'precip_sum'", "tag")
    .vis_lat_lon(polyline_=False) 

)
