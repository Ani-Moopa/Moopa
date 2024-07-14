import { DiscussionEmbed } from "disqus-react";

type DisqusCommentsProps = {
  post: {
    name: string;
    url: string;
    title: string;
    episode: number;
  };
};

const DisqusComments = ({ post }: DisqusCommentsProps) => {
  const disqusShortname = post.name || "your_disqus_shortname";
  const disqusConfig = {
    url: post.url,
    identifier: post.url, // Single post id
    title: `${post.title} - Episode ${post.episode}`, // Single post title
  };

  return (
    <div>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};
export default DisqusComments;
