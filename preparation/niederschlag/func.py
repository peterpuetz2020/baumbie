# %%
import numpy as np
import os
from IPython.display import display

from copy import deepcopy
from functools import wraps
from pandas.core.base import PandasObject

def as_method(func):

    """
    This decrator makes a function also available as a method.
    The first passed argument must be a DataFrame.
    """
    # from functools import wraps
    # from copy import deepcopy
    # import pandas as pd
    # from pandas.core.base import PandasObject

    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*deepcopy(args), **deepcopy(kwargs))

    setattr(PandasObject, wrapper.__name__, wrapper)

    return wrapper

@as_method
def flatten_columns(DF, sep = "_"):
    
    DF.columns = [sep.join(col).strip() for col in DF.columns.values]

    return DF



@as_method
def normalize_column(df, new_column_name):
    """
    Adds a column with normalized values (0–1 range) based on the new_column_name column.
    
    Parameters:
        df (pd.DataFrame): Input DataFrame with an new_column_name column.
        new_column_name (str): Name of the new normalized column.
    
    Returns:
        pd.DataFrame: DataFrame with the new normalized column added.
    """
    ami_min = df[new_column_name].min()
    ami_max = df[new_column_name].max()

    if ami_max == ami_min:
        df[f'{new_column_name}_normalized'] = 0.001  # or NaN, depending on how you want to handle constant values
    else:
        df[f'{new_column_name}_normalized'] = (df[new_column_name] - ami_min) / (ami_max - ami_min)
    
    return df



@as_method
def augment_reason_column(DF, str_template, column_name="Reason", print_row=0, round_=1):
    from pandas.api.types import is_numeric_dtype
    import re

    # Just like R:)
    # lst_ = str_template.split("`")

    # This one is far more flexible:
    lst_ = re.split("'|\"|`", str_template)

    series_ = ""
    for i in lst_:
        if i in DF.columns:
            if is_numeric_dtype(DF[i]):
                series_ += DF[i].round(round_).map(str)
            else:
                series_ += DF[i].map(str)
        else:
            series_ += i

    DF[column_name] = series_

    print(series_.values[print_row])

    return DF


@as_method
def vc(DF, str_column, rounding_precision=2, order_by_str_column=False):
    """Shows value_counts"""
    if type(str_column) == list:
        assert (
            len(str_column) == 1
        ), "If you use list as input argument, it must have length of 1!"
        str_column = str_column[0]

    df_vc = (
        DF[str_column]
        .value_counts(dropna=False)
        .reset_index()
        # .rename(columns={str_column: "count", "index": str_column})
    )

    if order_by_str_column:
        print(f"Sorting values based on this column: {str_column}")
        df_vc.sort_values(str_column, inplace=True)

    df_vc["cumulative_sum"] = df_vc["count"].cumsum()

    df_vc["%_of_total"] = df_vc["count"] / df_vc["count"].sum()

    df_vc["cumulative_sum_in_%"] = df_vc["cumulative_sum"] / df_vc["count"].sum()

    return df_vc.reset_index(drop=True).round(rounding_precision)




@as_method
def vis_lat_lon(
    DF,
    lat="lat",
    lon="lon",
    mapit=None,
    CircleMarker_=True,
    polyline_=True,
    show_counter=False,
):
    """
    Visualises lat and lon in a pd.DataFrame.
    It you provide these columns in your df, they will be used:
    tag, color, dash_array, radius, weight
    """

    from folium import Map, CircleMarker, PolyLine

    if mapit is None:
        print("making new map")
        mapit = Map(zoom_start=10)

    sw = DF[[lat, lon]].min().values.tolist()
    ne = DF[[lat, lon]].max().values.tolist()
    mapit.fit_bounds([sw, ne])

    lst_loc = []

    for i, coord in DF.iterrows():
        if show_counter:
            if i % 1000 == 0:
                print(len(DF) - i, "\t| Remaining Rows")

        coord = coord.to_dict()

        tag = coord["tag"] if "tag" in coord.keys() else ""
        color = coord["color"] if "color" in coord.keys() else "blue"
        dash_array = coord["dash_array"] if "dash_array" in coord.keys() else 1
        radius = coord["radius"] if "radius" in coord.keys() else 1
        weight = coord["weight"] if "weight" in coord.keys() else 2

        lst_coord = [coord[lat], coord[lon]]
        lst_loc.append(lst_coord)

        if CircleMarker_:
            CircleMarker(
                location=lst_coord,
                radius=radius,
                color=color,
                tooltip=tag,
                fill_color=color,
            ).add_to(mapit)

    if polyline_:
        my_PolyLine = PolyLine(
            locations=lst_loc,
            color=color,
            # tooltip=tag,
            dash_array=dash_array,
            weight=weight,
        )
        mapit.add_child(my_PolyLine)

    return mapit

