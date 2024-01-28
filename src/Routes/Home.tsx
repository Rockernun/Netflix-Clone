import { useQuery } from "react-query";
import {
    IGetMoviesResult,
    IMovie,
    getMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
} from "../api";

import { AnimatePresence, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";

import { CategoryRow, Loader, Wrapper } from "../Styles/HomeStyled";
import MainDisplay from "../Components/MainDisplay";
import Slide from "../Components/Slide";
import Detail from "../Components/Detail";

function Home() {
  const { scrollY } = useScroll();
  const bigMovieMatch = useMatch("/movies/:movieId");

    const { data: trendingMovies, isLoading: trendingMoviesLoading } =
        useQuery<IGetMoviesResult>("movies", () => getMovies(1));

    const { data: popularMovies, isLoading: popularMoviesLoading } =
        useQuery<IGetMoviesResult>("popular", () => getPopularMovies(2));

    const { data: topRatedMovies, isLoading: topRatedMoviesLoading } =
        useQuery<IGetMoviesResult>("topRated", () => getTopRatedMovies(1));

    const { data: upcomingMovies, isLoading: upcomingMoviesLoading } =
        useQuery<IGetMoviesResult>("upcoming", () => getUpcomingMovies(2));

    let clickedMovie: any = {
        backdrop_path: "",
        poster_path: "",
        title: "",
        overview: "",
        id: 0,
    };

    function isMovieClicked() {
        let moives: any;
        let category = "";

        if (bigMovieMatch?.params.movieId) {
            category = bigMovieMatch?.params.movieId.slice(0, 3);
            if (category === "trd") {
                moives = trendingMovies;
            } else if (category === "pop") {
                moives = popularMovies;
            } else if (category === "top") {
                moives = topRatedMovies;
            } else {
                moives = upcomingMovies;
            }
            clickedMovie = moives?.results.find(
                (movie: any) =>
                    movie.id + "" === bigMovieMatch.params.movieId?.slice(3)
            );
        }
    }

    isMovieClicked();
    return (
        <Wrapper>
            {trendingMoviesLoading ||
            popularMoviesLoading ||
            topRatedMoviesLoading ||
            upcomingMoviesLoading ? (
                <Loader>Loading</Loader>
            ) : (
                <>
                    <MainDisplay
                        id={trendingMovies?.results[0].id + ""}
                        category="trd"
                        title={trendingMovies?.results[0].title}
                        overview={trendingMovies?.results[0].overview}
                        bgIamgePath={trendingMovies?.results[0].backdrop_path}
                    ></MainDisplay>

                    <CategoryRow>
                        <Slide
                            data={trendingMovies}
                            title="Trending Now"
                            category="trd"
                        ></Slide>
                    </CategoryRow>

                    <CategoryRow>
                        <Slide
                            data={popularMovies}
                            title="Popular on Netflix"
                            category="pop"
                        ></Slide>
                    </CategoryRow>

                    <CategoryRow>
                        <Slide
                            data={topRatedMovies}
                            title="Top Rated"
                            category="top"
                        ></Slide>
                    </CategoryRow>

                    <CategoryRow>
                        <Slide
                            data={upcomingMovies}
                            title="Upcoming"
                            category="upc"
                        ></Slide>
                    </CategoryRow>
                    <AnimatePresence>
                        {bigMovieMatch ? (
                            <>
                                <Detail
                                    bigMovieMatch={bigMovieMatch}
                                    clickedMovie={clickedMovie}
                                    y={scrollY.get()}
                                ></Detail>
                            </>
                        ) : null}
                    </AnimatePresence>
                </>
            )}
        </Wrapper>
    );
}

export default Home;