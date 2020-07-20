import React from "react";
import Page from "./Page";
import { Divider, Typography } from "antd";
import Email from "../images/email.svg";
function FAQ() {
  const { Title } = Typography;
  return (
    <Page>
      <div style={{ padding: "0 5vw 5vw 4vw" }}>
        <div className="about">
          <div>
            <div style={{ padding: "5px" }}>
              <h3>FAQ</h3>
              <Divider />
              <p className="question">
                You just called me an urban/suburban/rural-ite.{" "}
                How <i>dare</i> you?
              </p>
              <p className="about answer">
                First off, hi, nice to meet you too... Secondly, I didn't call
                you an urban/suburban/rural-ite, the{" "}
                <a href="https://www.hud.gov/">
                  Department of Housing and Urban Development
                </a>{" "}
                did. Sort of.
              </p>
              <p className="about answer">
                A group of researchers at HUD took data from
                something called the{" "}
                <a href="https://www.census.gov/programs-surveys/ahs.html">
                  2017 Housing Survey
                </a>
                , in which households were asked to describe their neighborhood
                as urban, suburban or rural. Using that data the HUD team then
                applied machine learning (
                <i>see also: Skynet™, The Matrix™, other scary sci-fi stuff</i>)
                to build a model to predict how likely someone would be to
                describe their neighborhood as urban, suburban, or rural.
              </p>
              <p className="about answer">
                What you're seeing are the results of that model applied to
                census data to show you just how likely someone in any given
                neighborhood is to describe that neighborhood as
                urban, suburban, or rural. Confused? Try this article from{" "}
                <a href="https://www.bloomberg.com/news/articles/2020-07-07/how-to-define-american-suburbs">
                  Bloomberg City Lab
                </a>{" "}
                which got me interested in the study to begin with.
              </p>
              <p className="about answer">
                Not confused, but now even more curious? You can find the entire
                study—<i>findings, raw data, all of it</i>—on{" "}
                <a href="https://www.huduser.gov/portal/AHS-neighborhood-description-study-2017.html#overview-tab">
                  HUD's website.
                </a>
              </p>
              <p className="question">So why'd you make this?</p>
              <p className="about answer">
                Well, short answer is I couldn't find
                anywhere else to just plug in an address and get the results
                from the study. All of the data is available in a spreadsheet, and
                is based on census tracts. I don't know about you, but until I
                read that article, I'd never even heard the phrase "census
                tract" let alone knew where to find one.
              </p>
              <p className="about answer">
                That was of course until I decided to make this thing. Now,
                thanks to <a href="https://cloud.google.com/maps-platform/">Google Maps</a> and the{" "}
                <a href="https://geocoding.geo.census.gov/">Census Geocoder</a>,
                I've saved you anywhere from two to three minutes of having to
                look stuff up in different places. Isn't the internet magic?
              </p>
              <p className="question">Got it, so you're into this sort of thing...</p>
              <p className="about answer">
                Sure am! In fact, this was also an excuse to play with some tech stuff, specifically: 
                <ul>
                <li><b>Front-end:</b> React, Ant Design</li>
                <li><b>Back-end:</b> Node.js, Express, Google App Engine, Google Cloud SQL (postgres) </li>
                <li><b>APIs:</b> Google Maps, Google Places, Census Geocoder</li>
                <li><b>Art:</b> Uplaps.com, Vecteezy.com</li>
                </ul>
              </p>
              <p className="question">Can I go now?</p>
              <p className="about answer">
                You sure can! But if you think of any other questions, gimme a holler on the ol' electronic mail: <img src={Email} style={{width: "9vw"}}/><br/>This was fun. We should do this more often.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
export default FAQ;
