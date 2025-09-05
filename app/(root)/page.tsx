
import SearchForm from "../../components/SearchForm";
import StartupCard from "@/components/StartupCard";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const query = (await searchParams).query;
  //create an fake post array 
  const posts = [
    {
      _createdAt: new Date().toISOString(),
      views: 100,
      author:{_id:1 , name :"Tushar" , image:"https://imgcdn.stablediffusionweb.com/2024/5/3/bc565b41-db3c-485e-98b3-7b484f800ad7.jpg"},
      _id: 1,
      description:"This is a sample description",
      image:"https://ikozmik.com/Content/Images/uploaded/its-free-featured.jpg",
      category:"Technology",
      title:"We Chilling"
    },
    {
      _createdAt: new Date().toISOString(),
      views: 200,
      author:{_id:2 , name :"John" , image:"https://imgcdn.stablediffusionweb.com/2024/5/3/bc565b41-db3c-485e-98b3-7b484f800ad7.jpg"},
      _id: 2,
      description:"This is a sample description",
      image:"https://ikozmik.com/Content/Images/uploaded/its-free-featured.jpg",
      category:"Technology",
      title:"We Chilling"
    },
    {
      _createdAt: new Date().toISOString(),
      views: 300,
      author:{_id:3 , name :"Doe" , image:"https://imgcdn.stablediffusionweb.com/2024/5/3/bc565b41-db3c-485e-98b3-7b484f800ad7.jpg"},
      _id: 3,
      description:"This is a sample description",
      image:"https://ikozmik.com/Content/Images/uploaded/its-free-featured.jpg",
      category:"Technology",
      title:"We Chilling"
    },
  ];

  return (
    <>
    <section className="pink_container">
      <h1 className="heading">Hello Coders , Lets See Where is the Bug</h1>
      <p className="sub-heading">Submit Ideas , Codes and Solution on Buggy Question , and Get Noticed in Virtual Competitions.</p>
      <SearchForm query = {query}/>
    </section>
      
       <section className="section_container">
            <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "All Startups"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: StartupTypeCard) => (
              <StartupCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No startups found</p>
          )}
        </ul>

       </section> 


    </>
  );
}

