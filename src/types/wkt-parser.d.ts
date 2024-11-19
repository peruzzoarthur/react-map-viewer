// wkt-parser.d.ts
declare module "wkt-parser" {
  interface Spheroid {
    name: string;
    a: number;
    rf: number;
  }

  interface Datum {
    name: string;
    SPHEROID: Spheroid;
  }

  interface Unit {
    name: string;
    convert: number;
  }

  interface GeoCS {
    name: string;
    DATUM: Datum;
    PRIMEM: {
      name: string;
      convert: number;
    };
    UNIT: Unit;
    type: string;
    projName: string;
    units: string;
    to_meter: number;
    datumCode: string;
    ellps: string;
    a: number;
    rf: number;
    srsCode: string;
  }

  interface ProjCS {
    PROJECTION: string;
    False_Easting: number;
    False_Northing: number;
    Central_Meridian: number;
    Standard_Parallel_1: number;
    Auxiliary_Sphere_Type: number;
    UNIT: Unit;
    type: string;
    projName: string;
    units: string;
    to_meter: number;
    datumCode: string;
    sphere: boolean;
    ellps: string;
    a: number;
    rf: number;
    standard_parallel_1: number;
    false_easting: number;
    false_northing: number;
    central_meridian: number;
    x0: number;
    y0: number;
    long0: number;
    lat0: number;
    lat1: number;
    srsCode: string;
  }

 export interface WktParsed {
    name: string;
    GEOGCS: GeoCS;
    PROJECTION: string;
    False_Easting: number;
    False_Northing: number;
    Central_Meridian: number;
    Standard_Parallel_1: number;
    Auxiliary_Sphere_Type: number;
    UNIT: Unit;
    type: string;
    projName: string;
    units: string;
    to_meter: number;
    datumCode: string;
    sphere: boolean;
    ellps: string;
    a: number;
    rf: number;
    standard_parallel_1: number;
    false_easting: number;
    false_northing: number;
    central_meridian: number;
    x0: number;
    y0: number;
    long0: number;
    lat0: number;
    lat1: number;
    srsCode: string;
  }

  function parseWKT(wkt: string): WktParsed;
  export default parseWKT;
}
