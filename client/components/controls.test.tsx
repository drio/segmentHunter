import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Controls from "./controls";

configure({ adapter: new Adapter() });

describe("CarouselButton", () => {
  it("renders a <button>", () => {
    const wrapper = shallow(
      <Controls
        segments={[]}
        weather={[
          {
            temp: 22,
            wind_deg: 0,
            wind_speed: 0,
            weather: { description: "" },
            dt: 1,
          },
        ]}
        profile={""}
        actionNewWindDirection={(n) => null}
        actionSegmentClick={(id) => null}
      />
    );
    expect(wrapper.name()).toBe("styled.div");
  });
});
