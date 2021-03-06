import React, { useState, useEffect } from "react"
import Markdown from "react-markdown"
import News from "../data/home/news.json"
import Welcome from "../data/home/home.json"
import MustReadData from "../data/home/mustRead"

// Re-rendering is limited to this component only
const NewsSection = (props) => {
    const news = { ...News[props.yearIndex] }

    const [arrayIndex, setArrayIndex] = useState(0)
    useEffect(() => {
        const timer = setTimeout(() => {
            setArrayIndex((arrayIndex + 1) % props.arrayLength)
        }, 6000)
        return () => {
            clearTimeout(timer)
        }
        // eslint-disable-next-line
    }, [arrayIndex])

    return (
        <article
            className="center mw6 mw6-ns br3 hidden ba b--black-10"
            style={{ boxShadow: "2px 2px 4px 0px rgba( 0, 0, 0, 0.25 )" }}
        >
            <h1 className="f4 bg-near-white br3 br--top mid-gray mv0 pv2 ph3"> 最新消息 </h1>
            <div className="pv3 ph3 bt b--black-10 v-mid tc f5" style={{ animation: "fadedAnimation 6s infinite" }}>
                <span className="ph1 dark-red b"> {news[arrayIndex].type} </span>
                <span className="ph2 near-black"> {news[arrayIndex].description} </span>
            </div>
        </article>
    )
}

const Home = () => {
    const today = new Date()
    const year = today.getFullYear()
    let yearIndex, arrayLength
    try {
        yearIndex = "year " + year.toString()
        arrayLength = News[yearIndex].length
    } catch (err) {
        yearIndex = "year " + (year - 1).toString()
        arrayLength = News[yearIndex].length
    }

    const [open, setOpen] = useState([])
    function handleClickOpen(index) {
        const list = { ...open }
        list[index] = !list[index]
        setOpen(list)
    }

    const [eng, setEng] = useState(false)
    function handleClickEng() {
        setEng(!eng)
    }
    const EngButton = (props) => (
        <button
            className={props.attributes + " absolute b link dim grow pa1 bn"}
            style={{
                right: props.border,
                top: props.border,
            }}
            onClick={() => handleClickEng()}
        >
            {" "}
            {eng ? "中" : "EN"}
        </button>
    )

    // 1.(key, value) pairs are viewed as an array, thus: [key, value]
    // 2. The following codes convert the value of a kv - pair directly to the.md format
    // Extra:
    // If there is a tab in front of lines of.md file, ex:
    // `
    //         ## content here
    //     `
    // The tab is viewed as a "code block", thus changing the font of the content and preventing the h2 tag from behaving the way we expected.
    //     Therefore, do not format the data and start from the beginning of each line instead.
    // If the data is already formatted as the above, we can convert code blocks into individual Markdown components:
    //     > renderers={ { code: ({ value }) => <Markdown source={value} /> } }
    // source: https://github.com/rexxars/react-markdown/issues/134

    const mustRead = { ...MustReadData }
    Object.entries(mustRead).forEach(([key, value]) => {
        mustRead[key] = <Markdown source={value} />
    })
    const section = Object.entries(mustRead).map((value, index) => {
        return (
            <div className="center mw6 mw7-ns hidden mv3 br1 bg-near-white" key={value[0]}>
                <button
                    className="dim w-100 f4 mv0 pv2 ph3 bn near-black self-fw440"
                    onClick={() => handleClickOpen(index)}
                >
                    {value[0]} <b> </b>
                    {!open[index] ? (
                        <span className="dib link near-black" style={{ animation: "shiftDownAnimation 2s infinite" }}>
                            {" "}
                            ↓{" "}
                        </span>
                    ) : (
                            <span className="dib link near-black" style={{ animation: "shiftUpAnimation 2s infinite" }}>
                                {" "}
                            ↑{" "}
                            </span>
                        )}
                </button>
                {open[index] ? (
                    <div className="tl pa3 bt b--dark-gray">
                        <div className="f5 f5-ns ph1 lh-copy center"> {value[1]} </div>
                        <button className="dim grow w-100 f4 pt1 bn fw5" onClick={() => handleClickOpen(index)}>
                            {" "}
                            ↑{" "}
                        </button>
                    </div>
                ) : null}
            </div>
        )
    })

    return (
        <div>
            <NewsSection yearIndex={yearIndex} arrayLength={arrayLength} />
            <section
                className="mt4 mw7 mw7-ns center bg-mid-gray pv3 ph5-ns relative"
                style={{ boxShadow: "0px 10px 8px -2px rgba( 0, 0, 0, 0.6 )" }}
            >
                <EngButton border="12px" attributes="near-white f5" />
                <h1 className="mb4 self-gold">{eng ? Welcome["head-en"] : Welcome["head-ch"]}</h1>
                <div className="lh-copy center f5 ph4 pb3 white">
                    {eng ? Welcome["content-en"] : Welcome["content-ch"]}
                </div>
                <div className="ph2"> {section} </div>
            </section>
        </div>
    )
}

export default Home
