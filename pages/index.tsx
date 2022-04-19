import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

function splitTimer(timer: string): { hours: string; mins: string; secs: string } {
    const timeData = timer.split(":");
    const hours = timeData[0];
    const mins = timeData[1];
    const secs = timeData[2];
    return { hours, mins, secs };
}

function getLength(time: number) {
    if (time.toString().length === 1) {
        return true;
    }
    return false;
}

const Home: NextPage = () => {
    const initialTimer = "00:00:00";
    const [timer, setTimer] = useState<string>(initialTimer);
    const [start, setStart] = useState<boolean>(false);
    const [timeout, setTime] = useState<NodeJS.Timeout>(setTimeout(() => {}, 0));

    function handleWithTimerSecs(isOneValue: boolean, hours: string, mins: string, secs: string) {
        isOneValue ? setTimer(`${hours}:${mins}:0${secs}`) : setTimer(`${hours}:${mins}:${secs}`);
    }

    function handleWithTimerMins(isOneValue: boolean, hours: string, mins: string) {
        isOneValue ? setTimer(`${hours}:0${mins}:00`) : setTimer(`${hours}:${mins}:00`);
    }

    function handleWithTimerHours(isOneValue: boolean, hours: string) {
        isOneValue ? setTimer(`0${hours}:00:00`) : setTimer(`${hours}:00:00`);
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            function timerCycle() {
                const { hours, mins, secs } = splitTimer(timer);
                if (start && secs !== "59") {
                    const newSecs = parseInt(secs) + 1;
                    handleWithTimerSecs(getLength(newSecs), hours, mins, newSecs.toString());
                }
                if (start && secs === "59") {
                    const newMins = parseInt(mins) + 1;
                    handleWithTimerMins(getLength(newMins), hours, newMins.toString());
                }
                if (start && mins === "59") {
                    const newHours = parseInt(hours) + 1;
                    handleWithTimerHours(getLength(newHours), newHours.toString());
                }
            }
            timerCycle();
        }, 1000);
        setTime(timeout);
    }, [timer, start]);

    function stopCounter() {
        clearTimeout(timeout);
        setStart(!start);
    }
    function clearCounter() {
        setTimer(initialTimer);
        clearTimeout(timeout);
        setStart(false);
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{timer}</title>
                <meta name="description" content="StopWatch App" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={`${styles.stopwatchContainer} ${styles.glassEffect}`}>
                <span className={styles.title}>TIMER</span>
                <div className={styles.stopwatchCircle}>
                    <div className={`${styles.timer} ${styles.glassEffect}`}>
                        <span>{timer}</span>
                    </div>
                </div>
                <div className={styles.btnWrapper}>
                    <button onClick={() => stopCounter()} className={`${styles.stopwatchBtn} ${styles.glassEffect}`}>
                        {start === true ? "Stop" : "Start"}
                    </button>
                    {start == true ||
                        (timer !== initialTimer && (
                            <button onClick={() => clearCounter()} className={`${styles.stopwatchBtn} ${styles.glassEffect}`}>
                                Clear
                            </button>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
