"use client";

import React from "react";

type CcpaIconProps = React.SVGProps<SVGSVGElement>;

const CcpaIcon: React.FC<CcpaIconProps> = (props) => (
  <svg
    {...props} // để truyền className, style, v.v.
    version="1.1"
    id="Layer_1"
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    viewBox="0 0 30 14"
    xmlSpace="preserve"
  >
    <title>California Consumer Privacy Act (CCPA) Opt-Out Icon</title>
    <g>
      <g id="final---dec.11-2020_1_">
        <g
          id="_x30_208-our-toggle_2_"
          transform="translate(-1275.000000, -200.000000)"
        >
          <g id="Final-Copy-2_2_" transform="translate(1275.000000, 200.000000)">
            <path
              d="M7.4,12.8h6.8l3.1-11.6H7.4C4.2,1.2,1.6,3.8,1.6,7S4.2,12.8,7.4,12.8z"
              style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                fill: "#FFFFFF",
              }}
            />
          </g>
        </g>
      </g>
      <g id="final---dec.11-2020">
        <g
          id="_x30_208-our-toggle"
          transform="translate(-1275.000000, -200.000000)"
        >
          <g id="Final-Copy-2" transform="translate(1275.000000, 200.000000)">
            <path
              d="M22.6,0H7.4c-3.9,0-7,3.1-7,7s3.1,7,7,7h15.2c3.9,0,7-3.1,7-7S26.4,0,22.6,0z M1.6,7c0-3.2,2.6-5.8,5.8-5.8
              h9.9l-3.1,11.6H7.4C4.2,12.8,1.6,10.2,1.6,7z"
              style={{
                fillRule: "evenodd",
                clipRule: "evenodd",
                fill: "#0066FF",
              }}
            />
            <path
              id="x"
              d="M24.6,4c0.2,0.2,0.2,0.6,0,0.8l0,0L22.5,7l2.2,2.2c0.2,0.2,0.2,0.6,0,0.8c-0.2,0.2-0.6,0.2-0.8,0
              l0,0l-2.2-2.2L19.5,10c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8l0,0L20.8,7l-2.2-2.2c-0.2-0.2-0.2-0.6,0-0.8
              c0.2-0.2,0.6-0.2,0.8,0l0,0l2.2,2.2L23.8,4C24,3.8,24.4,3.8,24.6,4z"
              style={{ fill: "#FFFFFF" }}
            />
            <path
              id="y"
              d="M12.7,4.1c0.2,0.2,0.3,0.6,0.1,0.8l0,0L8.6,9.8C8.5,9.9,8.4,10,8.3,10c-0.2,0.1-0.5,0.1-0.7-0.1l0,0
              L5.4,7.7c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l0,0L8,8.6l3.8-4.5C12,3.9,12.4,3.9,12.7,4.1z"
              style={{ fill: "#0066FF" }}
            />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default CcpaIcon;
