export default function CourseHeader({ title, creator }: { title: string, creator: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold mt-2">{title}</h1>
      <p className="text-muted-foreground">By {creator}</p>
    </div>
  );
}
