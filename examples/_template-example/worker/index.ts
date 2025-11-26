export default {
  fetch() {
    return Response.json({ message: 'Hello, world!' })
  },
} satisfies ExportedHandler<Env>
