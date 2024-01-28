import { useQuery } from "react-query";
import { IGetMoviesResult, getMovies } from "../api";
import { IMovie } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";


const Wrapper = styled.div`
  background-color: black;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{bgPhoto: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 18px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto: string}>`
  background-color: white;
  height: 200px;
  background-image: url(${props => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  font-size: 64px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  opacity: 0;
  background-color: ${props=>props.theme.black.lighter};
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 8px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: scrollY.get() + 100;
  left: 0; 
  right: 0;
  margin: 0 auto;
`;


const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const BoxVariatns = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -30,
    transition: {
      delay: 0.4,
      duration: 0.2,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover:{
    opacity: 1,
    transition: {
      delay: 0.4,
      duration: 0.2,
      type: "tween",
    },
  }
}

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const {scrollY} = useScroll();
  const {data, isLoading} = useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if(data){
      if(leaving) return;
    toggleLeaving();
    const totalMovies = data.results.length - 1;
    const maxIndex = Math.floor(totalMovies / offset) - 1;
    setIndex((prev) => prev === maxIndex ? 0 : prev + 1);
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId:number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOverlayClick = () => navigate(-1);
  return (
    <Wrapper>{isLoading ? (<Loader>Loading...</Loader>) : (
    <>
      <Banner onClick={increaseIndex} bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
        <Title>{data?.results[0].title}</Title>
        <Overview>{data?.results[0].overview}</Overview>
      </Banner>
      <Slider>
        <AnimatePresence
        initial={false}
        onExitComplete={toggleLeaving}
        >
        <Row 
          variants={rowVariants}
          key={index}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{type:"tween", duration: 0.7}}
         >
          {data?.results.slice(1)
          .slice(offset*index, offset*index+offset)
          .map((movie) => (
          <Box 
          layoutId={movie.id + ""}
          key={movie.id} 
          whileHover="hover"
          initial="normal"
          variants={BoxVariatns}
          onClick={() => onBoxClicked(movie.id)}
          transition={{type: "tween"}}
          bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
          >
            <Info variants={infoVariants}>
              <h4>{movie.title}</h4>
            </Info>
          </Box>
          ))}
        </Row>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
        <>
        <Overlay 
        onClick={onOverlayClick}
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        />
        <BigMovie 
        style={{top: scrollY.get() + 100}}
        layoutId={bigMovieMatch.params.movieId}>hello</BigMovie>
          </>
          ) : null}
      </AnimatePresence>
    </>
    )}
    </Wrapper>
  );
}

export default Home;

