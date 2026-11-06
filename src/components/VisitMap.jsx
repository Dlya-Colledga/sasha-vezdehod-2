import React from "react";
import { ArrowUpRight, MapPin } from "lucide-react";

export const GIS_URL =
  "https://2gis.kg/bishkek/branches/70000001020790888/firm/70000001019368747/74.585255%2C42.87697?m=74.585382%2C42.876875%2F20.34%2Fp%2F43.62";

const options = {
  pos: {
    lat: 42.87697,
    lon: 74.585255,
    zoom: 17,
  },
  opt: {
    city: "bishkek",
  },
  org: "70000001019368747",
};

const mapUrl =
  "https://widgets.2gis.com/widget?type=firmsonmap&options=" +
  encodeURIComponent(JSON.stringify(options));

export default function VisitMap() {
  return (
    <div className="visit-map">
      <div className="visit-map-top">
        <span>
          <MapPin size={15} />
          НАЙДИ НАС В БИШКЕКЕ
        </span>

        <span className="visit-map-live">
          <i />
          2ГИС
        </span>
      </div>

      <div className="visit-map-frame">
        <iframe
          src={mapUrl}
          title="Карта расположения ресторана в Бишкеке — 2ГИС"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />

        <div className="visit-map-corner">✦</div>
      </div>

      <div className="visit-map-bottom">
        <div>
          <strong>Ждём тебя под луной.</strong>
          <span>Бишкек · Кыргызстан</span>
        </div>

        <a
          href={GIS_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Открыть расположение в 2ГИС"
        >
          Открыть в 2ГИС
          <ArrowUpRight size={18} />
        </a>
      </div>
    </div>
  );
}
