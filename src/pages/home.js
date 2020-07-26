import React, { Component } from 'react';
import Markdown from 'react-markdown';
import News from '../data/home/news.json';
import Welcome from '../data/home/home.json';
import MustReadData from '../data/home/mustRead';

class Home extends Component {
    constructor(props) {
        super(props);
        const today = new Date();
        const year = today.getFullYear();
        let yearIndex;
        try { yearIndex = "year " + year.toString(); }
        catch (err) { yearIndex = "year " + (year - 1).toString(); }

        this.state = {
            yearIndex: yearIndex,
            arrayIndex: 0,
            open: [],
            eng: false
        }
    }

    handleClickOpen(index) {
        this.setState(state => {
            const list = state.open;
            list[index] = !list[index];
            return list;
        })
    }

    handleClickEng() { this.setState({ eng: !this.state.eng }); }

    componentDidMount() {
        this.timeout = setInterval(() => {
            this.setState({ arrayIndex: (this.state.arrayIndex + 1) % News[this.state.yearIndex].length });
        }, 6000);
    }

    componentWillUnmount() {
        clearInterval(this.timeout);
        this.setState({ open: [] })
    }

    render() {
        const { yearIndex, arrayIndex, open, eng } = this.state;
        const news = { ...News[yearIndex] };

        const EngButton = (props) => <button
            className={props.attributes + " absolute b link dim grow pa1 bn"}
            style={{
                right: props.border,
                top: props.border
            }}
            onClick={() => this.handleClickEng()}
        > {eng ? "中文" : "EN"}
        </button>;

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

        const mustRead = { ...MustReadData };
        Object.entries(mustRead).forEach(([key, value]) => {
            mustRead[key] = <Markdown source={value} />
        });

        const section = Object.entries(mustRead).map((value, index) => {
            return (
                <div className="center mw6 mw7-ns hidden mv3 br1 bg-near-white" key={value[0]}>
                    <button className="dim w-100 f4 mv0 pv2 ph3 bn near-black"
                        onClick={() => this.handleClickOpen(index)}
                    >
                        {value[0]} <b> </b>
                        {!open[index] ?
                            <span className="dib link near-black"
                                style={{ animation: "shiftDownAnimation 2s infinite" }}
                            > ↓ </span>
                            :
                            <span className="dib link near-black"
                                style={{ animation: "shiftUpAnimation 2s infinite" }}
                            > ↑ </span>
                        }
                    </button>
                    {open[index] ?
                        <div className="tl pa3 bt b--dark-gray">
                            <div className="f5 f5-ns ph1 lh-copy center"> {value[1]} </div>
                            <button className="dim grow w-100 f4 pt1 bn"
                                onClick={() => this.handleClickOpen(index)}
                            > ↑ </button>
                        </div>
                        : null
                    }
                </div>
            )
        });

        return (
            <div>
                <article className="center mw6 mw6-ns br3 hidden ba b--black-10"
                    style={{ boxShadow: "2px 2px 4px 0px rgba( 0, 0, 0, 0.25 )" }}
                >
                    <h1 className="f4 bg-near-white br3 br--top mid-gray mv0 pv2 ph3"> 最新消息 </h1>
                    <div className="db pv3 ph2 ph4-ns bt b--black-10 v-mid tc"
                        style={{ animation: "fadedAnimation 6s infinite" }}
                    >
                        <span className="ph2 f5 dark-red b"> {news[arrayIndex].type} </span>
                        <span className="ph2 f5 near-black"> {news[arrayIndex].description} </span>
                    </div>
                </article>

                <section className="mt4 mw7 mw7-ns center bg-mid-gray pv3 ph2 ph5-ns relative"
                    style={{ boxShadow: "0px 10px 8px -2px rgba( 0, 0, 0, 0.6 )" }}
                >
                    <EngButton border="12px" attributes="near-white f5" />
                    <h1 className="mb4 self-gold">
                        {eng ? Welcome["head-en"] : Welcome["head-ch"]}
                    </h1>
                    <div className="lh-copy center f5 ph4 pb3 white">
                        {eng ? Welcome["content-en"] : Welcome["content-ch"]}
                    </div>
                    <div className="ph2"> {section} </div>
                </section>
            </div>
        );
    }
}

// In the following example, React Hooks works, but the timer will be affected/stalled on re-rendering.
// Each call to function handleClickOpen() and handleClickEng() causes re-rendering.
// I haven't found the solution yet :(
/*
const Home = () => {

    ...

    const [arrayIndex, setArrayIndex] = useState(0);
    useEffect(() => {
        const timeout = setInterval(() => {
            setArrayIndex((arrayIndex + 1) % arrayLength);
        }, 1000);
        return () => clearInterval(timeout);
    });

    const [open, setOpen] = useState([]);
    function handleClickOpen(index) {
        const list = { ...open };
        list[index] = !list[index];
        setOpen(list);
    }

    const [eng, setEng] = useState(false);
    function handleClickEng() {
        setEng(!eng);
    }

    ...
}
*/

export default Home;