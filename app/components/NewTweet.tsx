export default function NewTweet() {
  const addTweet = async () => {
    console.log("submitted");
  };

  return (
    <form onSubmit={addTweet}>
      <input type="title" />
    </form>
  );
}
