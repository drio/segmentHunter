import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import Controls from "./controls";

configure({ adapter: new Adapter() });

const TestControl = (
  <Controls
    segments={[
      {
        id: 1,
        start_latitude: 1,
        start_longitude: 2,
        end_latitude: 10,
        end_longitude: 20,
        name: "segment1",
        map: { polyline: "polyhere22xx" },
        distance: 15,
      },
    ]}
    weather={[
      {
        temp: 22,
        wind_deg: 0,
        wind_speed: 0,
        weather: { description: "" },
        dt: 1602173489, // ~ Thu 12:11 pm
      },
      {
        temp: 20,
        wind_deg: 0,
        wind_speed: 10,
        weather: { description: "" },
        dt: 1602173489 + 60 * 60, // ~ Thu 1:11 pm
      },
    ]}
    profile={"/url/here"}
    actionNewWindDirection={(n) => null}
    actionSegmentClick={(id) => null}
  />
);

describe("<Controls/>", () => {
  it("renders without the list of segments on start", () => {
    const wrapper = shallow(TestControl);
    expect(wrapper.name()).toBe("styled.div");
    expect(wrapper.find("#containerListSegments").exists()).toBe(false);
    expect(wrapper.find("#hideShowButton").text()).toBe("show");
  });

  it("renders the list of segments when the user requests it", () => {
    const wrapper = shallow(TestControl);
    wrapper.find("#hideShowButton").simulate("click");
    expect(wrapper.find("#hideShowButton").text()).toBe("hide");
    expect(wrapper.find('input[type="checkbox"]').length).toBe(1);

    wrapper.find("#hideShowButton").simulate("click");
    expect(wrapper.find("#hideShowButton").text()).toBe("show");
    expect(wrapper.find('input[type="checkbox"]').length).toBe(0);
  });

  it("we catch a bug where we were showing an incorrect time after updating the slider", () => {
    const wrapper = shallow(TestControl);
    wrapper.find("#weatherSlider").simulate("change", { target: { value: 1 } });
    expect(wrapper.find("#timeString").text()).toBe("Thursday, 1:11 pm");
    wrapper.find("#weatherSlider").simulate("change", { target: { value: 0 } });
    expect(wrapper.find("#timeString").text()).toBe("Thursday, 12:11 pm");
  });
});
