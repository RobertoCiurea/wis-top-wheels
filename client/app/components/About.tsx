"use client"
import {useEffect, useRef, useState} from "react";
import type { ChangeEvent } from "react";
import Image from "next/image";
import VolumeIcon from "@/public/icons/volume-icon.svg";
import MuteIcon from "@/public/icons/mute-icon.svg";
import "@/app/styles/about.css";
export const About = ()=>{
    const [volume, setVolume] = useState(1);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const updateVolume = (e: ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            if (newVolume > 0 && muted) {
                setMuted(false);
            }
            if(newVolume === 0 && !muted) {
                setMuted(true);
            }
        }
    };

    const toggleMute = () => {
        if (!videoRef.current) return;
        const nextMuted = !muted;
        setMuted(nextMuted);
        videoRef.current.muted = nextMuted;
        if(!muted) setVolume(0);
        else setVolume(1);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;

        if (playing) {
            videoRef.current.pause();
            setPlaying(false);
        } else {
            videoRef.current.play();
            setPlaying(true);
        }
    };

    const handleLoadedMetadata = () => {
        console.log("Video metadata loaded");
        if (!videoRef.current) return;
        console.log("Metadata loaded, video duration:", videoRef.current.duration);
        const videoDuration = Number.isFinite(videoRef.current.duration) ? videoRef.current.duration : 0;
        setDuration(videoDuration);
        setCurrentTime(videoRef.current.currentTime || 0);
    };



    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleEnded = () => {
        setPlaying(false);
    };

    const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!videoRef.current || duration <= 0) return;
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));
        const newTime = percent * duration;
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            videoRef.current.muted = muted;
        }

    }, [volume, muted]);
    useEffect(() => {
                handleLoadedMetadata();
    },[])
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  


    return(
        <section className="section" id="about">
        <div className="container">
            <div className="about-grid">
            <div className="about-visual reveal reveal-inversed visible  ">
                <div className="video-player">
                    <video 
                        ref={videoRef}
                        onClick={togglePlay}
                        className="video-player__media"
                        preload="metadata"
                        poster="/video/about-thumbnail.png"
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                    >
                        <source src="/video/about-video.mp4" type="video/mp4"/>
                        <source src="/video/about-video.webm" type="video/webm"/>

                        Your browser does not support the video tag.
                    </video>
                <div className="video-player__frame"></div>

                <button className="vp-overlay" style={{ opacity: playing ? '0' : '1', pointerEvents: playing ? 'none' : 'auto' }} onClick={togglePlay} aria-label="Play video" title="Play video">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="rgba(0,0,0,0.45)"/>
                    <path d="M9 7v10l8-5-8-5z" fill="white"/>
                    </svg>
                </button>

                <div className="vp-controls" aria-hidden="true">
                    <div className="vp-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progressPercent)} onClick={handleProgressClick}>
                        <div className="vp-progress__filled" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <div className="vp-controls__row">
                    <button className="vp-btn vp-btn--play" onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
                        {playing ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M8 7h3v10H8V7zm5 0h3v10h-3V7z" fill="currentColor"/></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 7v10l8-5-8-5z" fill="currentColor"/></svg>
                        )}
                    </button>
                    <div className="vp-time">{formatTime(currentTime)} / {formatTime(duration)}</div>

                    <div className="vp-volume-wrap" aria-hidden="false">
                        <input className="vp-volume" type="range" step="0.01" min={0} max={1} value={volume} aria-label="Volume" onChange={updateVolume}/>
                    </div>

                    <button className="vp-btn vp-btn--mute" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"}>
                    <Image src={muted ? MuteIcon : VolumeIcon} alt="Mute/Unmute" width="18" height="18"/>
                    </button>
                    </div>
                </div>

                </div>

            </div>
            <div className="reveal visible">
                <div className="eyebrow">Despre WIS Top Wheels</div>
                <div className="section-header">
                <h2 className="display d2">Pasiune pentru<br/><span className="accent">automobile</span></h2>
                </div>
                <p className="lead" style={{marginBottom: "24px"}}>Suntem cei mai de încredere furnizori de jante, mașini și servicii de vulcanizare din zona Argeșului. Calitate verificată, prețuri corecte, onestitate totală.</p>
                <p style={{fontSize: "15px", color: "var(--gray)", lineHeight: "1.75", marginBottom: "36px"}}>Fiecare piesă din stocul nostru este inspectată manual înainte de a ajunge la client. Importăm direct din Germania, selectăm cu atenție și oferim suport post-vânzare real.</p>
                <div className="about-features">
                <div className="about-feat">
                    <div className="feat-icon">✅</div>
                    <div className="feat-body">
                    <h4>Jante verificate & second-hand</h4>
                    <p>Stoc permanent de jante originale OEM și aftermarket, pentru toate mărcile populare.</p>
                    </div>
                </div>
                <div className="about-feat">
                    <div className="feat-icon">🇩🇪</div>
                    <div className="feat-body">
                    <h4>Import direct din Germania</h4>
                    <p>Mașini selectate manual, cu istoric verificat și documentație completă.</p>
                    </div>
                </div>
                <div className="about-feat">
                    <div className="feat-icon">🤝</div>
                    <div className="feat-body">
                    <h4>Transparență totală</h4>
                    <p>Îți arătăm tot — defecte, istoric, kilometraj. Fără surprize după cumpărare.</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>

    )
}