import { useEffect, useState } from "react";
import SearchResult from "../SearchResult/SearchResult";
import "./Search.css";
import { userApiRequests } from "../../apiRequests";

const Search = ({ setOpen }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        const search = async () => {
            try {
                const response = await userApiRequests.search(searchQuery);
                if (response.status === 200) {
                    setSearchResult(response.data.map(
                        result => <SearchResult
                            setOpen={setOpen}
                            searchResult={result}
                        />
                    ));
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (searchQuery) {
            search();
        }
    }, [searchQuery])

    return (
        <div className="search">
            <div className="search--header">
                <h1 style={{ color: "white" }}>Search</h1>
                <input
                    id="search"
                    size={43}
                    type="text"
                    placeholder="Search"
                    onChange={(event) => setSearchQuery(event.target.value)}
                />
            </div>
            <div className="search--results">
                {searchResult}
            </div>
        </div>
    )
}

export default Search;